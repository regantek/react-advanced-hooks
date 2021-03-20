import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

const appReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: "", completed: false }];
    case "DELETE":
      return state.filter((item) => item.id !== action.payload);
    case "COMPLETED": {
      return state.map((item) => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      });
    }
    case "RESET": {
      return action.payload;
    }

    default:
      return state;
  }
};

const Context = createContext();

const useEffectOnce = (cb) => {
  const didRun = useRef(false);
  useEffect(() => {
    if (!didRun.current) {
      cb();
      didRun.current = true;
    }
  });
};

const ToDosApp = () => {
  const [state, dispatch] = useReducer(appReducer, []);

  useEffectOnce(() => {
    const raw = localStorage.getItem("data");
    dispatch({ type: "RESET", payload: JSON.parse(raw) });
  });

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={dispatch}>
      <h1>ToDos App</h1>
      <button onClick={() => dispatch({ type: "ADD" })}>ADD TODO</button>
      <br />
      <br />

      <ToDosList items={state} />
    </Context.Provider>
  );
};

const ToDosList = ({ items }) => {
  return items.map((item) => <ToDoItem key={item.id} {...item} />);
};

const ToDoItem = ({ id, text, completed }) => {
  const dispatch = useContext(Context);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
      key={id}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => dispatch({ type: "COMPLETED", payload: id })}
      />
      <input type="text" defaultValue={text} />
      <button onClick={() => dispatch({ type: "DELETE", payload: id })}>
        X
      </button>
    </div>
  );
};

export default ToDosApp;
