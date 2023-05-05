import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTodoList,
  addTodo,
  updateTodo,
  sortTodo,
  toggleCompleted,
} from "../ToDoSlice";
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import empty from "../assets/empty.jpg";

function ToDoList() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (localTodoList) {
      dispatch(setTodoList(localTodoList));
    }
  }, []);

  const handleAddTodo = (task) => {
    if (task.trim().length === 0) {
      alert("Por favor, adicione uma tarefa");
    } else {
      dispatch(addTodo({ task: task, id: Date.now() }));
      setNewTask("");
      setShowModal(true);
    }
  };

  const handleUpdateToDoList = (id, task) => {
    if (task.trim().length === 0) {
      alert("Por favor, adicione uma tarefa");
    } else {
      dispatch(updateTodo({ task: task, id: id }));
      setShowModal(false);
    }
  };

  const handleDeleteToDo = (id) => {
    const updatedToDoList = todoList.filter((todo) => todo.id != id);
    dispatch(setTodoList(updatedToDoList));
    localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
  };

  function handleSort(sortCriteria) {
    dispatch(sortTodo(sortCriteria));
  }

  const sortToDoList = todoList.filter((todo) => {
    if (sortCriteria === "Geral") return true;
    if (sortCriteria === "Concluídas" && todo.completed) return true;
    if (sortCriteria === "Não Concluídas" && !todo.completed) return true;
    return false;
  });

  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };

  return (
    <div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack flex items-center justify-center">
          <div className="w-[450px] bg-white p-8 rounded-md">
            <input
              className="w-full border border-gray-600 p-2 rounded-md outline-none mb-8"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={
                currentTodo ? "Atualize sua tarefa" : "Adicione uma tarefa"
              }
            />
            <div className="flex justify-between">
              {currentTodo ? (
                <>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleUpdateToDoList(currentTodo.id, newTask);
                    }}
                    className="bg-sunsetOrange text-white py-3 px-10 rounded-md"
                  >
                    Salvar
                  </button>
                  <button
                    className="bg-Tangaroa rounded-md text-white py-3 px-10"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-sunsetOrange text-white py-3 px-10 rounded-md"
                    onClick={() => {
                      handleAddTodo(newTask);
                      setShowModal(false);
                    }}
                  >
                    Adicionar
                  </button>
                  <button
                    className="bg-Tangaroa rounded-md text-white py-3 px-10"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className=" flex items-center justify-center flex-col">
        {todoList.length === 0 ? (
          <div className="mb-6">
            <div className="sm:w-[430px] sm:h-[430px] min-w-[250px] min-[250px]">
              <img src={empty} alt="lista de tarefas vazia" />
              <p className="text-center text-Gray">
                Você ainda não tem tarefas, adicione uma!
              </p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto mt-6">
            <div className="flex justify-center mb-6">
              <select
                onChange={(e) => handleSort(e.target.value)}
                className="p-1 outline-none text-sm font-semibold"
              >
                <option value="Geral" className="text-sm font-semibold">
                  Geral
                </option>
                <option
                  value="Concluídas"
                  className="text-greenTeal text-sm font-semibold"
                >
                  Concluídas
                </option>
                <option
                  value="Não Concluídas"
                  className="text-sunsetOrange text-sm font-semibold"
                >
                  Não Concluídas
                </option>
              </select>
            </div>
            <div>
              {sortToDoList.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between mb-2 bg-gray-300 mx-auto w-full md:w-[75%] rounded-md p-3"
                >
                  <div
                    className={`${
                      todo.completed
                        ? "line-through text-greenTeal text-lg font-medium"
                        : "text-sunsetOrange text-lg font-medium"
                    }`}
                    onClick={() => {
                      handleToggleCompleted(todo.id);
                    }}
                  >
                    {todo.task}
                  </div>
                  <div>
                    <button
                      className="bg-blue-500 text-white p-1 rounded-md ml-2"
                      onClick={() => {
                        setShowModal(true);
                        setCurrentTodo(todo);
                        setNewTask(todo.task);
                      }}
                    >
                      <TiPencil />
                    </button>
                    <button
                      className="bg-sunsetOrange text-white p-1 rounded-md ml-2"
                      onClick={() => handleDeleteToDo(todo.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          className="bg-sunsetOrange text-center text-white py-3 px-10 rounded-md mt-4"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Adicionar Tarefa
        </button>
      </div>
    </div>
  );
}

export default ToDoList;
