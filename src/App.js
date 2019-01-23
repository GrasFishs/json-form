import React, { Component } from "react";
import "./App.css";
import JsonForm from "./JsonForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <JsonForm
            json={[
              {
                type: "radio",
                key: "name",
                title: "字母",
                defaultValue: "A",
                props: {
                  options: { 1: "A", 2: "B", 3: "C" }
                }
              },
              {
                type: "checkbox",
                key: "hobby",
                title: "爱好",
                defaultValue: ["Apple"],
                props(form) {
                  let options = [
                    { label: "Apple", value: "Apple" },
                    { label: "Pear", value: "Pear" },
                    { label: "Orange", value: "Orange" }
                  ];
                  if (form.name.value === "B") {
                    options = [
                      { label: "Apple", value: "Apple" },
                      { label: "Pear", value: "Pear" }
                    ];
                  }
                  return {
                    options
                  };
                }
              }
            ]}
            onChange={change => console.log(change)}
          />
        </header>
      </div>
    );
  }
}

export default App;
