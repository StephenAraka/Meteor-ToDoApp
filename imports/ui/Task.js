import React, { Component, createElement } from 'react';
import { Tasks } from "../api/tasks.js";
import { Meteor } from "meteor/meteor";

// Task component - represents a single todo item
export default class Task extends Component {
    render() {
        // give the checked & unchecked guys unique class names
        var taskClassName = this.props.task.checked ? "checked" : "";

        return (
            createElement("li", { className: taskClassName },
                createElement("button", { className: "delete", onClick: this.deleteTask }, "DELETE"),
                createElement("input", { type: "checkbox", checked: !!this.props.task.checked, onClick: this.toggleChecked }),
                createElement("span", { className: "text" },
                    createElement("strong", {}, this.props.task.username, ": "),
                    this.props.task.text
                )
            )
        )
    }

    toggleChecked = () => {
        // set checked ptoperty to opposite of current
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteTask = () => {
        Meteor.call('tasks.remove', this.props.task._id);
    }

}