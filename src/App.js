import React, {useState} from 'react';
import './App.css';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _ from "lodash";
import {v4} from "uuid";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const item = {
  id: v4(),
  title: "Hello1",
  text: "Clean the house",
  taskStatus: true
}

const item2 = {
  id: v4(),
  title: "World1",
  text: "Wash the car",
  taskStatus: false
}

function App() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState("")
  const [taskStatus, setTaskStatus] = useState(false)

  const [show, toggleShow] = React.useState(true);

  const [state, setState] = useState({
    "current": {
      title: "Current",
      items: [item, item2]
    },
    "icebox": {
      title: "IceBox",
      items: []
    },
    "backlog": {
      title: "Backlog",
      items: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = {...state[source.droppableId].items[source.index]}

    setState(prev => {
      prev = {...prev}
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)


      // Adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              title: title,
              text: text,
              taskStatus: taskStatus

            },
            ...prev.todo.items
          ]
        }
      }
    })

    setText("")
    setTitle("")
    setTaskStatus(false)
  }

  return (
    <div>
      <div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
        <input type='checkbox' checked={taskStatus} value={taskStatus} onChange={(e) => setTaskStatus(e.currentTarget.checked)}/>
        <button onClick={addItem}>Add</button>
      </div>
      <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"} >
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return(
                    <div

                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`droppable-col` }

                    >
                      {data.items.map((el, index) => {
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided, snapshot) => {
                              console.log(snapshot)
                              return(
                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <p>{el.title}</p>
                                  <p>{el.text}</p>
                                  <p>{el.taskStatus ? "Yess" : "Noo"}</p>
                                  <CopyToClipboard className = "childDiv" text={`Description-${el.text}`}>
                                    <span>Copy</span>
                                  </CopyToClipboard>
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
              <div>Completed: {data.items.filter(task => task.taskStatus).length}/{data.items.length}</div>

            </div>
          )
        })}
      </DragDropContext>
      </div>
    </div>
  );
}

export default App;
