import React, { useState } from "react";
import { StyleSheet, View, Modal, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const UploadImage = ({ navigation }) => {
  const [modal, setModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [ImageUrlList, setImageUrlList] = useState([]);
  const [returnImageUrl, setReturnImageUrl] = useState("");
  const [returnImageUrlList, setReturnImageUrlList] = useState([]);
  const flask_url = "http://c5a947bb9bd5.ngrok.io/predict";

  // =============================================================

  const submitData = () => {
    const tempReturnImageUrlList = returnImageUrlList;
    fetch(flask_url, {
      method: "POST",
      body: JSON.stringify({ imageUrl: imageUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { returnImage } = data;
        tempReturnImageUrlList.push(returnImage);
        setReturnImageUrlList(tempReturnImageUrlList);
        setReturnImageUrl(returnImage);
        setModal(false);
        Alert.alert("Image uploaded and analysis done.");
        // console.log("return image", returnImageUrl);
      })
      .catch((err) => console.log(err));
  };

  // =============================================================

  const handleUpload = (image) => {
    const data = new FormData();
    const tempImageUrlList = ImageUrlList;
    data.append("file", image);
    data.append("upload_preset", "faceblurApp");
    data.append("cloud_name", "dut46ysdc");

    fetch("https://api.cloudinary.com/v1_1/dut46ysdc/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        tempImageUrlList.push(data.url);
        setImageUrlList(tempImageUrlList);
        setImageUrl(data.url);
        Alert.alert("Image successfully uploaded");
        setModal(false);
      });
  };

  // ===============================================================

  // Image from gallery
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [1, 2],
        quality: 1,
        exif: true,
      });

      if (!data.cancelled) {
        let newFile = {
          uri: data.uri,
          type: `image/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(",")[1]}`,
        };

        // console.log(data);
        handleUpload(newFile);
      }
    }
  };

  // ==============================================================

  // Image from camera
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 2],
        quality: 1,
        exif: true,
      });

      if (!data.cancelled) {
        let newFile = {
          uri: data.uri,
          type: `image/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(",")[1]}`,
        };

        handleUpload(newFile);
      }
    } else {
      Alert.alert("Allow access to the camera.");
    }
  };

  // ==============================================================

  return (
    <>
      <View style={styles.root}>
        <Button
          theme={theme}
          style={styles.uploadStyle}
          mode="contained"
          onPress={() => setModal(true)}
        >
          Upload
        </Button>

        <Button
          theme={theme}
          style={styles.analyseStyle}
          mode="contained"
          onPress={() => {
            submitData();

            // navigation.navigate("Home");
          }}
        >
          Analyse
        </Button>

        {imageUrl !== "" ? (
          <Button
            theme={theme}
            style={styles.viewimage}
            mode="contained"
            onPress={() =>
              navigation.navigate("Image", {
                images: ImageUrlList,
              })
            }
          >
            View Uploaded Image
          </Button>
        ) : null}

        {returnImageUrl !== "" ? (
          <Button
            theme={theme}
            style={styles.returnimage}
            mode="contained"
            onPress={() =>
              navigation.navigate("Image", {
                images: returnImageUrlList,
              })
            }
          >
            View Output Image
          </Button>
        ) : null}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => setModal(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <Button
                theme={theme}
                style={{ width: "80%" }}
                mode="contained"
                onPress={() => {
                  return pickFromCamera();
                }}
              >
                Camera
              </Button>
            </View>
            <View style={styles.modalButtonView}>
              <Button
                theme={theme}
                style={{ width: "80%" }}
                mode="contained"
                onPress={() => {
                  return pickFromGallery();
                }}
              >
                Gallery
              </Button>
            </View>
            <Button theme={theme} onPress={() => setModal(false)}>
              Cancel
            </Button>
          </View>
        </Modal>
      </View>
    </>
  );
};

const theme = {
  colors: {
    primary: "#000",
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // justifyContent: "center",
  },
  uploadStyle: {
    fontSize: 18,
    borderColor: "#000",
    margin: 40,
    position: "absolute",
    left: 0,
  },
  viewimage: {
    fontSize: 18,
    position: "absolute",
    left: 0,
  },
  returnimage: {
    fontSize: 18,
    position: "absolute",
    right: 0,
  },
  analyseStyle: {
    fontSize: 18,
    borderColor: "#000",
    margin: 40,
    position: "absolute",
    right: 0,
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  modalView: {
    position: "absolute",
    bottom: 4,
    width: "100%",
    backgroundColor: "#ddd",
  },
});

export default UploadImage;
