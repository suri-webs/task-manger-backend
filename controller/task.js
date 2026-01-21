const taskModel = require("../model/task");

// create task handler
async function handleCreateTask(req, res) {
  try {
    const user = req.userData;
    const taskData = req.body; // will contain description and lastDate
    const newTask = await taskModel.create({
      ...taskData,
      createdBy: user.username,
      personDoing: user.username,
    });

    res.json(newTask);
  } catch (error) {
    res.json(error);
  }
}

// list tasks for a user and filter them based in search query
async function handleTaskForRelatedUser(req, res) {
  try {
    const user = req.userData;
    let searchCondition = [];

    const { search, limit = 2, page = 1 } = req.query;

    if (search) {
      const regexQuery = new RegExp(search.trim(), "i"); // makes query case-insensitive

      // insert first condition for filtering based on search
      searchCondition.push(
        {
          $or: [
            { description: regexQuery },
            { createdBy: regexQuery },
            { personDoing: regexQuery },
            { status: regexQuery },
          ],
        },
      );
    }

    /**
     * insert second condition to filter tasks based on user role
     * if user is not admin show only tasks that are related to the current logged in user
     * */
    if (user.role.toLowerCase() === "user") {
      searchCondition.push({
        $or: [{ createdBy: user.username }, { personDoing: user.username }],
      });
    }

    const tasks = await taskModel
      .find({ $and: searchCondition })
      .skip(parseInt((page - 1) * limit))
      .limit(parseInt(limit));

    const totalTasks = await taskModel.countDocuments({
      $and: searchCondition,
    });

    if (tasks.length == 0) {
      return res.json({ message: "no Task Found" });
    } else {
      // sending data , totalpages, currentPageNumber, totalTasks
      return res.json({
        data: tasks,
        totalTasks: totalTasks,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / limit),
        limit:limit
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

// update task
async function handleUpdateTask(req, res) {
  try {
    const user = req.userData;
    const { id } = req.query;

    let taskToUpdate = await taskModel.findById(id);

    taskToUpdate = taskToUpdate.toObject();
    // checks if loggedin user is related to task
    // even admin cannot update task if admin is not related to task
    if (
      user.username !== taskToUpdate.createdBy &&
      user.username !== taskToUpdate.personDoing
    ) {
      return res.status(401).json({ error: "Unautorized to update this task" });
    }

    const newTask = {
      ...taskToUpdate,
      updatedAt: Date.now(),
      ...req.body,
      createdBy: taskToUpdate.createdBy, // not to be change fields
      createdAt: taskToUpdate.createdAt, // not to be change fields
    };

    // set completion Date
    if (newTask.status === "completed" && taskToUpdate.status === "pending") {
      newTask.completedAt = Date.now();
    }

    const updatedTask = await taskModel.findByIdAndUpdate(id, newTask, {
      new: true,
    });

    return res.json({
      data: {
        updatedTask: updatedTask,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error: error.message });
  }
}

// search queries
// async function handleSearchTask(req,res){
//   try {
//     const user = req.userData;

//     // query params : q = string
//     const query = req.query.q;

//     return res.json({query});

//   return res.json({data:user});

//   } catch (error) {
//     console.log(error);
//     res.status(501).json({error:error.message})
//   }
// }

module.exports = {
  handleCreateTask,
  handleTaskForRelatedUser,
  handleUpdateTask,
  // handleSearchTask,
};
