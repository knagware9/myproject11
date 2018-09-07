import React, { Component } from "react";
import PropTypes from "prop-types";
import { vsClass, splitVsProps, HtmlEntity } from "../../utilities/utils";
import iconList from "./icon-list";

const propTypes = {
  icn: PropTypes.string
};

class icon extends Component {
  render() {
    const { icn, className, ...props } = this.props;
    const [vsProps, elementProps] = splitVsProps(props);

    /**
     * before adding icon in data-attr
     * we are converting hex code in html entity
     */
    const HTMLEDecodedIcn = HtmlEntity.decode(iconList[icn]);
    elementProps["data-icon"] = HTMLEDecodedIcn;
    
    return (
      <span {...elementProps} style={{...styles.base, ...elementProps.style}} className={className}>
        {HTMLEDecodedIcn}
        <span style={styles.Screenreader} key="{Screenreader}">
          {icn}
        </span>
      </span>
    );
  }
}

icon.propTypes = propTypes;

export default vsClass("icon", icon);

const styles = {
  base: {
    fontFamily: "icomoon",
    position: "relative",
    display: "inline-block",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: 1,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    verticalAlign: "middle",
    speak: "none",
    color: "inherit"
  },
  Screenreader: {
    position: "absolute",
    top: "-9999px",
    left: "-9999px"
  }
};
