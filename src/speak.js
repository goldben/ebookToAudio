import React from "react";
import Speech from "speak-tts";

export class Speak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
	  sentences: [],

	  sentence: '',
    };
	this.speak = this.speak.bind(this);

  }



  async speak(e) {
    const speech = new Speech();
    // speech.init; // will throw an exception if not browser supported
    if (speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    }
    console.log("this.props.txt", this.props.txt);

    const { getPlayText } = this.props;
    const text = (getPlayText && getPlayText()) || this.props.txt;
	const sentences = text.split("."&&"?"&&"!");
	let num = 0;
    this.setState({ sentences: sentences });

    speech
      .init({
        volume: 0.5,
        lang: "en-GB",
        rate: 0.9,
        pitch: 1,
        voice: "Google UK English Female"
      })
      .then(data => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data.voices[5]);
      })
      .catch(e => {
        console.error("An error occured while initializing : ", e);
      });
    const resumeButton = document.getElementById("resume");
    const pauseButton = document.getElementById("pause");

	const that = this
    setTimeout(speak, 300);
    function speak() {
      speech
        .speak({
          text: text,
          queue: false, // current speech will be interrupted,
          listeners: {
            onstart: () => {
              console.log("Start utterance");


			  			  let newSentence = sentences[num]
			  			  console.log(newSentence);
						  that.setState({
				  	  	sentence: newSentence
				  		})
			  			  num += 1
            },
            onend: () => {
              console.log("End utterance");
            },
            onresume: () => {
              console.log("Resume utterance");
            },
            onboundary: event => {
              console.log(
                event.name +
                  " boundary reached after " +
                  event.elapsedTime +
                  " milliseconds."
              );
            }
          }
        })
        .then(() => {
          console.log("Success !");
        })
        .catch(e => {
          console.error("An error occurred :", e);
        });
      pauseButton.addEventListener("click", () => {
        speech.pause();
      });
      resumeButton.addEventListener("click", () => {
        speech.resume();
      });
    }
  };

  render() {
    return (
      <div className="tts-bar">
        <div className="text-viewer">
          <p>{this.state.sentence}</p>
        </div>

        <div className="tts">
          <div>
            <span id="play" onClick={this.speak}>
              Play
            </span>
            <span id="pause"> Pause </span>
            <span id="resume"> Resume </span>
          </div>
        </div>
      </div>
    );
  }
}
