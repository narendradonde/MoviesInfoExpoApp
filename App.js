import { StyleSheet, Text, View, StatusBar, SafeAreaView, FlatList, Image, useWindowDimensions, TouchableOpacity, Modal, Pressable, BackHandler } from "react-native";
import moviesdata from "./data/moviedata";
import React, { useEffect, useState } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { ImageViewer } from "react-native-image-zoom-viewer";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";

export default function App() {
  const [moviesdataset, setMovieData] = useState(moviesdata);
  const [sortType, setSortType] = useState();

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const movieCardwidth = width < 500 ? width / 2 - 10 : width / 3 - 10;
  const movieImageHeight = width < 400 ? 180 : 280;

  const noCols = isLandscape ? 3 : 2;
  const movieYears = moviesdata.map((movie) => {
    return movie.Year;
  });

  const movieFilteredYears = [...new Set(movieYears)];

  const [visible, setVisible] = useState(false);
  const [singleMovie, setSingleMovie] = useState();
  const [imageZoomVisible, setImageZoomVisible] = useState(false);

  const actorsList = singleMovie?.Actors.split(",");
  const directorsList = singleMovie?.Director.split(",");
  const writersList = singleMovie?.Writer.split(",");
  const awardsList = singleMovie?.Awards.split(".");
  const zoomImage = [
    {
      url: singleMovie?.Poster,
    },
  ];

  const closeModal = () => {
    if (imageZoomVisible) {
      setImageZoomVisible(false);
    }
  };

  //console.log(actorsList);
  //console.log(singleMovie);
  const ActorsRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      {actorsList.map((actor, index) => {
        return <Text key={index}>{actor.trim()}</Text>;
      })}
    </View>
  );

  const DirectorsRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      {directorsList.map((director, index) => {
        return <Text key={index}>{director.trim()}</Text>;
      })}
    </View>
  );

  const WriterRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      {writersList.map((writer, index) => {
        return <Text key={index}>{writer.trim()}</Text>;
      })}
    </View>
  );

  const AwardsRoute = () => (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      {awardsList.map((award, index) => {
        return <Text key={index}>{award.trim()}</Text>;
      })}
    </View>
  );

  const renderScene = SceneMap({
    actor: ActorsRoute,
    director: DirectorsRoute,
    writer: WriterRoute,
    awards: AwardsRoute,
  });
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "actor", title: "Actors" },
    { key: "director", title: "Director(s)" },
    { key: "writer", title: "Writer(s)" },
    { key: "awards", title: "Award(s)" },
  ]);
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "darkslategrey",
        height: "100%",
      }}
      style={{
        backgroundColor: "darkseagreen",
      }}
      renderLabel={({ route }) => (
        <Text
          style={{
            color: "white",
            fontSize: 12,
          }}
        >
          {route.title}
        </Text>
      )}
      tabStyle={{
        paddingRight: 5,
        borderStyle: "solid",
        borderRightWidth: 1,
        borderRightColor: "gray",
      }}
    />
  );

  onPressView = (movieItem) => {
    //console.log(movieItem);
    setSingleMovie(movieItem);
    setVisible(true);
  };

  useEffect(() => {
    const sortArray = (type) => {
      let sortedMoviesData = [];
      const sortProperty = type;
      if (sortProperty === "Title") {
        sortedMoviesData = [...moviesdata].sort((a, b) => {
          if (a[sortProperty] < b[sortProperty]) {
            return -1;
          }
          if (a[sortProperty] > b[sortProperty]) {
            return 1;
          }
          return 0;
        });
      } else {
        sortedMoviesData = [...moviesdata].sort((a, b) => {
          return a[sortProperty] - b[sortProperty];
        });
      }
      setMovieData(sortedMoviesData);
    };

    sortArray(sortType);
  }, [sortType]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      justifyContent: "center",
    },
    flatList: {
      width: "100%",
      backgroundColor: "black",
    },
    movieInfo: {
      paddingRight: 5,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    movieTitle: {
      padding: 5,
      fontSize: 12,
      overflow: "hidden",
      fontWeight: "900",
      color: "white",
      minHeight: 40,
    },
    movieRatingYear: {
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 5,
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    movieRating: {
      fontSize: 12,
      color: "white",
    },
    movieYear: {
      fontSize: 12,
      color: "white",
    },
    posterImage: {
      width: "100%",
      height: movieImageHeight,
      resizeMode: "cover",
    },
    headerStyle: {
      backgroundColor: "darkcyan",
      padding: 10,
      marginBottom: 10,
    },
    listHeader: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "900",
      color: "white",
    },
    movieCard: {
      width: movieCardwidth,
      backgroundColor: "darkslategrey",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "darkslategrey",
      overflow: "hidden",
    },
    row: {
      flex: 1,
      justifyContent: "space-between",
      marginBottom: 5,
      padding: 5,
    },

    /* Modal styles */
    closeBtn: {
      alignSelf: "flex-end",
    },
    textStyle: {
      fontSize: 28,
      marginTop: 3,
      paddingHorizontal: 5,
      paddingTop: 5,
      marginBottom: 0,
      lineHeight: 20,
      color: "black",
    },
    popupCard: {
      alignItems: "flex-start",
      paddingHorizontal: 10,
      backgroundColor: "white",
      paddingVertical: 10,
    },
    popupCardMovieInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    popupMovieTitle: {
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
      backgroundColor: "darkslategrey",
      color: "white",
      padding: 5,
      width: "100%",
      marginBottom: 2,
    },
    popupMovieInfoLabel: {
      fontSize: 16,
      marginBottom: 3,
      color: "gray",
      borderStyle: "solid",
      borderBottomWidth: 0.5,
      borderColor: "lightgray",
      paddingBottom: 1,
    },
    popupMovieInfoText: {
      fontWeight: "700",
      color: "gray",
    },
    popupMoviePlot: {
      fontSize: 16,
      marginTop: 3,
      borderStyle: "solid",
      borderColor: "lightgray",
      borderBottomWidth: 1,
      borderTopWidth: 1,
      paddingVertical: 2,
      color: "gray",
      width: "100%",
    },
    sortBox: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 10,
    },
  });

  const sortByOptions = [
    { title: "IMDb Rating", value: "imdbRating" },
    { title: "Release Year", value: "Year" },
    { title: "Alphabetical", value: "Title" },
  ];

  header = () => {
    const dropdownStyles = StyleSheet.create({
      dropdownButtonStyle: {
        width: 120,
        height: 20,
        backgroundColor: "#E9ECEF",
        borderRadius: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        marginLeft: 5,
      },
      dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 12,
        fontWeight: "500",
        color: "#151E26",
      },
      dropdownButtonArrowStyle: {
        fontSize: 12,
      },
      dropdownButtonIconStyle: {
        fontSize: 12,
        marginRight: 8,
      },
      dropdownMenuStyle: {
        backgroundColor: "#E9ECEF",
        borderRadius: 8,
      },
      dropdownItemStyle: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 12,
        fontWeight: "500",
        color: "#151E26",
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
    });
    return (
      <View style={styles.headerStyle}>
        <Text style={styles.listHeader}>IMDb Top 250 Movies</Text>
        <View style={styles.sortBox}>
          <Text style={{ color: "#fff" }}>Sort by:</Text>
          <SelectDropdown
            data={sortByOptions}
            onSelect={(selectedItem, index) => {
              setSortType(selectedItem.value);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={dropdownStyles.dropdownButtonStyle}>
                  <Text style={dropdownStyles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || "Select Option"}</Text>
                  <FontAwesomeIcon name={isOpened ? "chevron-up" : "chevron-down"} style={dropdownStyles.dropdownButtonArrowStyle} />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View style={{ ...dropdownStyles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                  <Text style={dropdownStyles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={dropdownStyles.dropdownMenuStyle}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor={"darkseagreen"} style={{ padding: 10 }} />
      <FlatList
        data={moviesdataset}
        horizontal={false}
        numColumns={noCols}
        key={noCols}
        columnWrapperStyle={styles.row}
        style={styles.flatList}
        keyExtractor={(item) => item.imdbID}
        ListHeaderComponent={header}
        stickyHeaderIndices={[0]}
        renderItem={({ item, index }) => (
          <TouchableOpacity key={index.toString()} onPress={() => onPressView(item)}>
            <View style={styles.movieCard}>
              <Image
                style={styles.posterImage}
                source={{
                  uri: item.Poster,
                }}
              />

              <View style={styles.movieInfo}>
                <Text numberOfLines={2} style={styles.movieTitle}>
                  {item.Title}
                </Text>
                <Text style={{ marginTop: 5, opacity: 0.5 }}>
                  <FontAwesomeIcon name="info-circle" size={18} color="#fff" />
                </Text>
              </View>
              <View style={styles.movieRatingYear}>
                <Text style={styles.movieRating}>Rating: {item.imdbRating}</Text>
                <Text style={styles.movieYear}>{item.Year}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <ModalPopup visible={visible}>
        <Pressable onPress={() => setVisible(false)} style={styles.closeBtn}>
          <FontAwesomeIcon name="times-circle" size={24} color="#fff" />
        </Pressable>
        <View style={styles.popupCard}>
          <Text style={styles.popupMovieTitle}>{singleMovie?.Title}</Text>
          <View style={styles.popupCardMovieInfo}>
            <Pressable onPress={() => setImageZoomVisible(true)}>
              <Image
                style={{
                  height: 200,
                  resizeMode: "cover",
                  aspectRatio: 0.68,
                  borderWidth: 1,
                  borderColor: "gray",
                  marginRight: 10,
                  marginTop: 5,
                }}
                source={{ uri: singleMovie?.Poster }}
              />
            </Pressable>
            <View style={{ flex: 1, flexWrap: "nowrap" }}>
              <Text style={styles.popupMovieInfoLabel}>
                <Text style={[styles.popupMovieInfoText, { fontSize: 20 }]}>{singleMovie?.Released}</Text>
              </Text>
              <Text style={styles.popupMovieInfoLabel}>
                Duration:&nbsp;
                <Text style={styles.popupMovieInfoText}>{singleMovie?.Runtime}</Text>
              </Text>
              <Text style={styles.popupMovieInfoLabel}>
                IMDbRating:&nbsp;
                <Text style={styles.popupMovieInfoText}>{singleMovie?.imdbRating}</Text>
              </Text>
              <Text style={styles.popupMovieInfoLabel}>
                Language:&nbsp;
                <Text style={styles.popupMovieInfoText}>{singleMovie?.Language}</Text>
              </Text>
              <Text style={styles.popupMovieInfoLabel}>
                Box Office Revenue:{"\n"}
                <Text style={styles.popupMovieInfoText}>{singleMovie?.BoxOffice}</Text>
              </Text>
              <Text style={styles.popupMovieInfoLabel}>
                Genre:&nbsp;
                <Text style={styles.popupMovieInfoText}>{singleMovie?.Genre}</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.popupMoviePlot}>{singleMovie?.Plot}</Text>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{
            width: layout.width,
            height: layout.height,
          }}
        />
      </ModalPopup>
      <ModalImagePopup visible={imageZoomVisible}>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "#F5FCFF",
              flex: 1,
              width: "100%",
              height: "100%",
            }}
          >
            <ImageViewer imageUrls={zoomImage} enablePreload={true} useNativeDriver={true} enableSwipeDown={true} saveToLocalByLongPress={false} renderIndicator={() => null} onSwipeDown={closeModal} />
          </View>
        </SafeAreaView>
      </ModalImagePopup>
    </SafeAreaView>
  );
}

const ModalPopup = ({ visible, children }) => {
  // const movieDetails = moviesdata.find((item) => item.imdbID === movieId);
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    toggleVisible();
  }, [visible]);

  const toggleVisible = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };
  const styles = StyleSheet.create({
    modalView: {
      flex: 1,
      width: "100%",
      backgroundColor: "rgba(0,0,0,.9)",
    },
  });

  return (
    <Modal animationType="slide" transparent={true} visible={showModal} presentationStyle={"overFullScreen"}>
      <View style={styles.modalView}>{children}</View>
    </Modal>
  );
};
const ModalImagePopup = ({ visible, children }) => {
  const [isModalVisible, setIsModalVisible] = useState({ visible });

  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={() => {
        setIsModalVisible(!visible);
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </Modal>
  );
};
