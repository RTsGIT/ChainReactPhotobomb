import React, { Component } from 'react';
import { View, StatusBar, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Styles/HomeScreenStyles';
import { Images, Colors } from '../Themes';
import Button from '../Components/Button';
import { gql, graphql } from 'react-apollo';

const allPhotosQuery = gql`
  query {
    allPhotos(orderBy: createdAt_DESC) {
      id
      file {
        url
      }
    }
  }
`;

const photosSubscription = gql`
  subscription createPhoto {
    Photo(
      filter: {
        mutation_in: [CREATED]
      }
    ) {
      mutation
      node {
        id
        file {
          url
        }
      }
    }
  }
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.subscription = null;
    console.log('constructor');
  }

  componentWillMount() {
    console.log('will mount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive');
    if (this.props.subscriptionParam !== nextProps.subscriptionParam) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    debugger;
    if (!this.subscription && !nextProps.allPhotosQuery.loading) {
      this.subscription = nextProps.allPhotosQuery.subscribeToMore({
        document: photosSubscription,
        updateQuery: (previousState, { subscriptionData }) => {
          const newPhoto = subscriptionData.data.Photo.node;
          const allPhotos = [newPhoto, ...previousState.allPhotos];

          return {
            allPhotos
          };
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.purple} />

        {this.renderPhotos()}

        <View style={styles.cameraBar}>
          <Text
            style={styles.button}
            onPress={() => this.props.navigation.navigate('CameraScreen')}
          >
            [O]
          </Text>
        </View>
      </View>
    );
  }

  renderPhotos() {
    let { loading, error, allPhotos } = this.props.allPhotosQuery;

    if (error) {
      return (
        <View style={styles.contentWrapper}>
          <Image source={Images.portland} style={styles.backgroundImage} />
          <Text>ERR>R</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.contentWrapper}>
          <Image source={Images.portland} style={styles.backgroundImage} />
          <Image source={Images.logo} style={styles.logo} />
          <Text style={styles.appName}>Photobomb!</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.contentWrapper,
          { flexDirection: 'row', flexWrap: 'wrap' }
        ]}
      >
        <Image source={Images.portland} style={styles.backgroundImage} />
        {allPhotos.map(p => {
          return (
            <Image
              style={{ width: 100, height: 100 }}
              key={p.id}
              source={{
                uri: `${p.file.url.replace('files', 'images')}/300x300`
              }}
            />
          );
        })}
      </View>
    );
  }
}

const HomeScreenWithData = graphql(allPhotosQuery, { name: 'allPhotosQuery' })(
  HomeScreen
);
export default HomeScreenWithData;