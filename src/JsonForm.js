import React from "react";
import { Radio, Checkbox } from "antd";

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

function FormRadio({ item, onChange }) {
  return (
    <div>
      <span>{item.title}</span>
      <RadioGroup value={item.value} onChange={onChange}>
        {Object.keys(item.options).map(key => (
          <Radio key={key} value={item.options[key]}>
            {item.options[key]}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

function FormCheckbox({ item, onChange }) {
  return (
    <div>
      <span>{item.title}</span>
      <CheckboxGroup
        options={item.options}
        value={item.value}
        defaultValue={item.defaultValue}
        onChange={onChange}
      />
    </div>
  );
}

export default class JsonForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.trackJson({});
  }

  trackJson(prevState, key, value) {
    const state = { ...prevState };
    this.props.json.forEach(item => {
      const { key: itemKey } = item;
      if (!(itemKey in state)) {
        item.value = item.defaultValue;
      } else {
        if (itemKey === key) {
          item.value = value;
        } else {
          item.value = state[itemKey].value;
        }
      }
      state[itemKey] = item;
    });
    Object.keys(state).forEach(itemKey => {
      const props =
        typeof state[itemKey].props === "function"
          ? state[itemKey].props(state)
          : state[itemKey].props;
      state[itemKey].options = props.options;
      if (
        Array.isArray(props.options) &&
        !state[itemKey].value.every(item =>
          props.options.map(op => op.value).includes(item)
        )
      ) {
        state[itemKey].value = props.options.filter(item =>
          state[itemKey].value.includes(item.value)
        );
      }
    });
    console.log(state);
    return state;
  }

  handleChange(key, e) {
    const value = e.target ? e.target.value : e;
    const state = this.trackJson(this.state, key, value);
    this.setState(
      {
        [key]: {
          ...state[key]
        }
      },
      () => {
        const result = {};
        console.log(this.state);
        Object.keys(this.state).forEach(
          key => (result[key] = this.state[key].value)
        );
        this.props.onChange(result);
      }
    );
  }

  render() {
    return (
      <div>
        {Object.keys(this.state).map(key => {
          const { type } = this.state[key];
          if (type === "radio") {
            return (
              <FormRadio
                key={key}
                item={this.state[key]}
                onChange={this.handleChange.bind(this, key)}
              />
            );
          } else if (type === "checkbox") {
            return (
              <FormCheckbox
                key={key}
                item={this.state[key]}
                onChange={this.handleChange.bind(this, key)}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}
