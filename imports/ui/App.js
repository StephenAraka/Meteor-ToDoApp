import React, { createElement, Component } from 'react';
import ReactDOM from "react-dom";
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';

import Task from './Task.js';

// App component - represents the whole app
export class App extends Component {
    render() {
        return (
            createElement("div", { className: "container" },
                createElement("header", {},
                    createElement("h1", {}, "Todo List"),
                    createElement("form", { className: "new-task", onSubmit: this.handleSubmit },
                        createElement("input", { type: "text", ref: "textInput", placeholder: "Type to add new tasks" })),
                    createElement("ul", {}, this.renderTasks())
                )
            )
        );
    }

    renderTasks = () => {
        return this.props.tasks.map((task) => (
            <Task  key = { task._id} task = { task } />));
    }

    handleSubmit = () => {
        event.preventDefault();
        // using the react ref to find the text field
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        Tasks.insert({ text, createdAt: new Date() });
        ReactDOM.findDOMNode(this.refs.textInput).value = "";
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
})(App);