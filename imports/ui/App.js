import React, { createElement, Component } from 'react';
import ReactDOM from "react-dom";
import { withTracker } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import AccountsUIWrapper from "../ui/AccountsUIWrapper";

import Task from './Task.js';

// App component - represents the whole app
export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    render() {
        return (
            createElement("div", { className: "container" },
                createElement("header", {},
                    createElement("h1", {}, "Todo List  " + this.props.incompleteCount),
                    createElement("label", { className: "hide-completed" },
                        createElement("input", {
                            type: "checkbox",
                            checked: this.state.hideCompleted, onClick: this.toggleHideCompleted
                        }),
                        "HIDE COMPLETED TASKS"),
                    createElement(AccountsUIWrapper),
                    this.props.currentUser ?
                        createElement("form", { className: "new-task", onSubmit: this.handleSubmit },
                            createElement("input", {
                                type: "text", ref: "textInput",
                                placeholder: "Type to add new tasks"
                            })) : "",
                    createElement("ul", {}, this.renderTasks())
                )
            )
        );
    }

    handleSubmit = () => {
        event.preventDefault();
        // using the react ref to find the text field
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
        ReactDOM.findDOMNode(this.refs.textInput).value = "";
    }

    toggleHideCompleted = () => {
        this.setState({ hideCompleted: !this.state.hideCompleted });
    }

    renderTasks = () => {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />));
    }
}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user()
    };
})(App);