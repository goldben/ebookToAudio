import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { ReactReader } from "./modules";
import {
  Container,
  ReaderContainer,
  Bar,
  Logo,
  CloseButton,
  CloseIcon,
  FontSizeButton
} from "./Components";

const storage = global.localStorage || null;

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
  .tts-bar {
    width: 100%;
    display: flex;
	flex-direction: column;
    align-items: center;
    justify-content: center;
	position: fixed;
    bottom: 10vh;
	z-index: 10;

  }
  .tts {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    align-self: center;

    background-color: black;
    opacity: 0.8;
    height: 80px;
    width: 500px;
    border-radius: 30px;
  }
  .tts span {
    margin: 50px;
    text-align: center;
  }
  .text-viewer {
	  width: 600px;
	  height 600px;
	  background: white;
	  border: 2px solid black;
	  color: black;
	  padding: 10px;
	  overflow: hidden;
  }
  p {
	  font-size: 30px;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      location:
        storage && storage.getItem("epub-location")
          ? storage.getItem("epub-location")
          : 2,
      largeText: false
    };
    this.rendition = null;
  }

  toggleFullscreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        setTimeout(() => {
          const evt = document.createEvent("UIEvents");
          evt.initUIEvent("resize", true, false, global, 0);
        }, 1000);
      }
    );
  };

  onLocationChanged = location => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem("epub-location", location);
      }
    );
  };

  onToggleFontSize = () => {
    const nextState = !this.state.largeText;
    this.setState(
      {
        largeText: nextState
      },
      () => {
        this.rendition.themes.fontSize(nextState ? "140%" : "100%");
      }
    );
  };

  getRendition = rendition => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "140%" : "100%");
  };

  render() {
    const { fullscreen, location } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <Bar>
          <a href="https://github.com/gerhardsletten/react-reader">
            <Logo
              src="https://gerhardsletten.github.io/react-reader/files/react-reader.svg"
              alt="React-reader - powered by epubjs"
            />
          </a>
          <CloseButton onClick={this.toggleFullscreen}>
            Use full browser window
            <CloseIcon />
          </CloseButton>
        </Bar>
        <ReaderContainer fullscreen={fullscreen}>
          <ReactReader
            url={
              "https://gerhardsletten.github.io/react-reader/files/alice.epub"
            }
            locationChanged={this.onLocationChanged}
            title={"Alice in wonderland"}
            location={location}
            getRendition={this.getRendition}
          />
          <FontSizeButton onClick={this.onToggleFontSize}>
            Toggle font-size
          </FontSizeButton>
        </ReaderContainer>
      </Container>
    );
  }
}

export default App;
