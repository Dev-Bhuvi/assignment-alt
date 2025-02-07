import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import './TaskManager.css';
import dashlogo from '../images/Title.png';
import profile from '../images/profile.png';
import logoutimg from '../images/logout_icon.png';
import editicon from '../images/edit_icon.png';
import deleteicon from '../images/delete_icon.png';
import checkicon from '../images/checkmark.png';
import dragicon from '../images/drag_icon.png';
import listicon from '../images/list_icon.png';
import boardicon from '../images/board_icon.png';

const TaskManager = ({ user }) => {
    const [task, setTask] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [category, setCategory] = useState("Work");
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    const addTask = async () => {
        if (!task.trim()) return;
        await addDoc(collection(db, "tasks"), {
            userId: auth.currentUser.uid,
            task,
            dueDate,
            category,
            createdAt: new Date(),
            status: "Todo"
        });
        setTask("");
        setDueDate("");
        setCategory("Work");
    };

    const editTask = async (taskId, newTask) => {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { task: newTask });
    };

    const deleteTask = async (taskId) => {
        const taskRef = doc(db, "tasks", taskId);
        await deleteDoc(taskRef);
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { status: newStatus });
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        await updateTaskStatus(taskId, newStatus);
    };

    const filteredTasks = tasks.filter((t) =>
        t.task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
        setShowPopup(true);
    };



    const deleteSelectedTasks = async () => {
        await Promise.all(selectedTasks.map(async (taskId) => {
            const taskRef = doc(db, "tasks", taskId);
            await deleteDoc(taskRef);
        }));
        setSelectedTasks([]);
        setShowPopup(false);
    };

    return user ? (
        <div>
            <div className="container mt-md-3 headercon">
                <div className="row mobpadding">
                    <div className="col-6">
                        <img src={dashlogo} alt="logo" className="img-fluid taskbuddy" />
                        <div className="d-flex align-items-center mobhide">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active px-2 py-1" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">
                                        <img src={listicon} className="img-fluid" alt="list" /> List</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link px-2 py-1" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">
                                        <img src={boardicon} className="img-fluid" alt="board" /> Board</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-6 d-flex flex-column align-items-end">
                        <div className="profile d-flex align-items-center">
                            <img src={profile} alt="profile" className="img-fluid profileimage" />
                            <p className="ps-1 m-0 mobhide">{user.displayName}!</p>
                        </div>
                        <button onClick={() => signOut(auth)} className="logoutbtn mobhide">
                            <img src={logoutimg} className="img-fluid" alt="logout" /> Logout
                        </button>
                    </div>
                </div>
            </div>

<div className="showpopup">
            {showPopup && selectedTasks.length > 0 && (
                <div className="popup">
                    <div className="popupcontent d-flex align-items-center justify-content-between">
                        <div>
                    <p className="m-0 multiselectedvalues">{selectedTasks.length} Tasks Selected.</p>
                    </div>
                        <div>
                    <button className="cancel" onClick={() => setShowPopup(false)}>Cancel</button>
                    <button className="multidelete ms-1" onClick={deleteSelectedTasks}>Delete</button>
                    </div>
                    </div>
                </div>
            )}
</div>

            <div className="container mt-4">
                <div className="row">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="search mobhide">
                            <input
                                type="text"
                                className="form-control searchbar"
                                placeholder="Search tasks...?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="addtasks d-flex justify-content-end">
                            <input type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Task name" />
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                            <button onClick={addTask} className="addtask ms-1">ADD TASK</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                    <div className="container mt-2 mobhide">
                        <div className="row ">
                            <div className="col-md-3 text-center tableheading">
                                Task name
                            </div>
                            <div className="col-md-3 text-center tableheading">
                                Due on
                            </div>
                            <div className="col-md-3 text-center tableheading">
                                Track Status
                            </div>
                            <div className="col-md-3 text-center tableheading">
                                Track Category
                            </div>
                        </div>
                    </div>




                    {["Todo", "In-Progress", "Completed"].map((status) => (
                        <div key={status} className="container mt-2">
                            <div className="row">
                                <div className="accordion" id="accordionExample">
                                    <div
                                        className="accordion-item"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, status)}
                                    >
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button ${status.replace(/\s+/g, '').toLowerCase()}-btn`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse${status}`}
                                            >
                                                {status}
                                            </button>
                                        </h2>
                                        <div id={`collapse${status}`} className="accordion-collapse collapse show">
                                            <div className="accordion-body p-0">
                                                <ul>
                                                    {filteredTasks
                                                        .filter(t => {
                                                            // Normalize status values
                                                            const normalizedStatus =
                                                                t.status === "Todo" ? "Todo" :
                                                                    t.status === "In Progress" ? "In-Progress" :
                                                                        t.status;
                                                            return normalizedStatus === status;
                                                        })
                                                        .map((t) => (
                                                            <li key={t.id} draggable onDragStart={(e) => handleDragStart(e, t.id)}>
                                                                <div className="task d-flex justify-content-between align-items-center">
                                                                    <div className="taskview ps-2 d-flex mobwidth">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedTasks.includes(t.id)}
                                                                            onChange={() => toggleTaskSelection(t.id)}
                                                                        id="mycheckbox"/>
                                                                        <img src={dragicon} alt="logo" className="img-fluid" /><img src={checkicon} alt="logo" className="img-fluid" />
                                                                        {t.task}
                                                                    </div>
                                                                    <div className="taskview text-center mobhide">
                                                                        {t.dueDate || "No due date"}
                                                                    </div>
                                                                    <div className="taskview mobhide">
                                                                        <div className="task-status text-uppercase">{t.status}</div>
                                                                    </div>
                                                                    <div className="taskview text-center">
                                                                        <div className="d-flex align-items-center justify-content-end">
                                                                            <div className="text-start addwidth mobhide">
                                                                                <div className="">{t.category}</div>
                                                                            </div>
                                                                            <div className="actions">
                                                                                <button onClick={() => editTask(t.id, prompt("Edit Task", t.task))}><img src={editicon} alt="logo" className="img-fluid" /></button>
                                                                                <button onClick={() => deleteTask(t.id)}><img src={deleteicon} alt="logo" className="img-fluid" /></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>




                    ))}

                </div>
                <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                    <div className="container">
                        <div className="row addgap">

                            {["Todo", "In-Progress", "Completed"].map((status) => (


                                <div key={status} className="col-md-3 box mt-2">
                                    <div className="row">
                                        <div className="card" id="accordionExample">
                                            <div
                                                className="card-item"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => handleDrop(e, status)}
                                            >
                                                <h2 className="card-header p-0 mt-2 mb-3">
                                                    <button
                                                        className={`text-uppercase accordion-button ${status.replace(/\s+/g, '').toLowerCase()}-btn`}
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#collapse${status}`}
                                                    >
                                                        {status}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${status}`} className="accordion-collapse collapse show">
                                                    <div className="accordion-body p-0">
                                                        <div>
                                                            {filteredTasks
                                                                .filter(t => {
                                                                    // Normalize status values
                                                                    const normalizedStatus =
                                                                        t.status === "Todo" ? "Todo" :
                                                                            t.status === "In Progress" ? "In-Progress" :
                                                                                t.status;
                                                                    return normalizedStatus === status;
                                                                })
                                                                .map((t) => (
                                                                    <div className="taskcards d-flex flex-column justify-content-between mt-2" key={t.id} draggable onDragStart={(e) => handleDragStart(e, t.id)}>
                                                                        <div className="taskheader d-flex justify-content-between align-items-center">
                                                                            <div className="taskview">
                                                                                {t.task}
                                                                            </div>
                                                                            <div className="actions">
                                                                                <button onClick={() => editTask(t.id, prompt("Edit Task", t.task))}><img src={editicon} alt="logo" className="img-fluid" /></button>
                                                                                <button onClick={() => deleteTask(t.id)}><img src={deleteicon} alt="logo" className="img-fluid" /></button>
                                                                            </div>

                                                                        </div>
                                                                        <div className="taskheader d-flex justify-content-between align-items-center">
                                                                            <div className="text-start addwidth">
                                                                                <div className="">{t.category}</div>
                                                                            </div>
                                                                            <div className="taskview text-center">
                                                                                {t.dueDate || "No due date"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            ))}</div></div>
                </div>
            </div>
        </div>
    ) : (
       <></>
    );
};

export default TaskManager;