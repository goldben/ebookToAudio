import React from "react";
import Speech from "speak-tts";

export class ChooseFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  render() {
    return (
      <div className="choose-file">
<input type="file"></input>      </div>
    );
  }
}
