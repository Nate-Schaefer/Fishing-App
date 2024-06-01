import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function App({navigation}) {
  const [facing, setFacing] = useState('back');
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);

  const takePicture = async () => {
    if(camera) {
        const photo = await camera.takePictureAsync();
        setImage(photo.uri);
    }
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
        <View style={styles.camera}>
            <CameraView  ref={ref => setCamera(ref)} style={styles.camera} facing={facing} ratio={'1:1'}/>
        </View>

        <Button title="Flip Image" onPress={toggleCameraFacing}>
        </Button>
        <Button title="Take Picture" onPress={() => takePicture()} />
        <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
        <Button title="Save" onPress={() => navigation.navigate('Save', {image})} />

        {image && <Image source={{uri: image}} style={{flex:1}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});