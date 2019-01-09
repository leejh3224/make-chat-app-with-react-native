import { shallow } from "enzyme";
import Main from "Main";
import * as React from "react";
import { Text } from "react-native";

describe("test", () => {
  it("renders text correctly", () => {
    const wrapper = shallow(<Main />);
    const text = wrapper.find(Text);

    /**
     * To check text of Text component, you can reference .prop(children)
     */
    expect(text.prop("children")).toBe(
      "Open up App.js to start working on your app!"
    );
  });
});
