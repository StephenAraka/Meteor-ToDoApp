import React, { Component, createElement } from 'react';
import { Tasks } from "../api/tasks.js";
import { Meteor } from "meteor/meteor";
import classnames from 'classnames';

// Task component - represents a single todo item
export default class Task extends Component {
    render() {
        // give the checked & unchecked guys unique class names
        var taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
          });

        return (
            createElement("li", { className: taskClassName },
                createElement("button", { className: "delete", onClick: this.deleteTask }, "DELETE"),
                createElement("input", { type: "checkbox", checked: !!this.props.task.checked, onClick: this.toggleChecked }),
                this.props.showPrivateButton ?
                    createElement("button", { className: "toggle-private", onClick: this.togglePrivate.bind(this) },
                        this.props.task.private ? "Private" : "Public",
                    ) : "",
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

    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
      }    

    deleteTask = () => {
        Meteor.call('tasks.remove', this.props.task._id);
    }

}