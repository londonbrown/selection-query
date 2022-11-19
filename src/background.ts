import CreateMenuTask from "./task/CreateMenuTask"
const createMenuTask = new CreateMenuTask()
createMenuTask.run().then(() => {
  console.log("CreateMenuTask.run() completed.")
})
