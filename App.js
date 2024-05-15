import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import moviesdata from "./data/moviedata";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const movieCardwidth = width < 500 ? width / 2 - 10 : width / 3 - 10;
  const movieImageHeight = width < 500 ? 200 : 230;

  const noCols = isLandscape ? 3 : 2;
  const movieYears = moviesdata.map((movie) => {
    return movie.Year;
  });

  const movieFilteredYears = [...new Set(movieYears)];
  const filteredMovies = moviesdata.filter((item) => Number(item.Year) == 2020);

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
    movieTitle: {
      padding: 5,
      fontSize: 12,
      overflow: "hidden",
      fontWeight: "900",
      color: "white",
      minHeight: 40,
    },
    moveInfo: {
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
    listHeader: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "900",
      backgroundColor: "darkcyan",
      padding: 10,
      color: "white",
      marginBottom: 10,
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={"darkseagreen"}
        style={{ padding: 10 }}
      />
      <FlatList
        data={moviesdata}
        horizontal={false}
        numColumns={noCols}
        key={noCols}
        columnWrapperStyle={styles.row}
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image
              style={styles.posterImage}
              source={{
                uri: item.Poster,
              }}
            />
            <Text numberOfLines={2} style={styles.movieTitle}>
              {item.Title}
            </Text>
            <View style={styles.moveInfo}>
              <Text style={styles.movieRating}>Rating: {item.imdbRating}</Text>
              <Text style={styles.movieYear}>{item.Year}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.imdbID}
        ListHeaderComponent={
          <Text style={styles.listHeader}>IMDb Top 250 Movies</Text>
        }
        stickyHeaderHiddenOnScroll={true}
      />
    </SafeAreaView>
  );
}
