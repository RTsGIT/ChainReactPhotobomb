// TODO: react-native-config
const FILE_UPLOAD_API =
  'https://api.graph.cool/file/v1/cjc5ce2l40dty0181o2u0u07n';

export default async function(photo) {
  const pictureData = {
    uri: photo.path,
    name: 'photo.jpg',
    filename: 'photo.jpg',
    type: 'image/jpg'
  };

  let formData = new FormData();

  formData.append('data', pictureData);

  /**
     * NOTE: for upload to work right on Android platform, we MUST provide a
     * boundry in the Content-Type header.
     */
  const fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; boundary=asdf'
    },
    body: formData
  };

  const result = await fetch(FILE_UPLOAD_API, fetchOptions);
  return await result.json();
}
