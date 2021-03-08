import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";

import { ImageViewer } from "react-native-image-zoom-viewer";

export default class renderImage extends Component {
  render() {
    let imageUris = [];
    const images = this.props.navigation.getParam("images");
    if (images) {
      images.forEach((image) => {
        imageUris.push({ url: image });
      });
    }

    return <ImageViewer imageUrls={imageUris} />;
  }
}

const styles = StyleSheet.create({});
