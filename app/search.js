import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { wp, hp } from "../utils/responsive";
import { useRouter } from "expo-router";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //  Perform search
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);

    try {
      let postsQuery = query(
        collection(db, "posts"),
        where("text", ">=", searchText),
        where("text", "<=", searchText + "\uf8ff")
      );

      let usersQuery = query(
        collection(db, "users"),
        where("name", ">=", searchText),
        where("name", "<=", searchText + "\uf8ff")
      );

      const postSnap = await getDocs(postsQuery);
      const userSnap = await getDocs(usersQuery);

      const postResults = postSnap.docs.map((doc) => ({
        id: doc.id,
        type: "post",
        ...doc.data(),
      }));

      const userResults = userSnap.docs.map((doc) => ({
        id: doc.id,
        type: "user",
        ...doc.data(),
      }));

      setResults([...userResults, ...postResults]);
    } catch (error) {
      console.error("Error searching:", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search posts or users..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <Text style={styles.loading}>Searching...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item.type === "user" ? (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => router.push(`/profile/${item.id}`)}
              >
                <Text style={styles.userText}>👤 {item.name}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.resultItem}>
                <Text style={styles.postText}>📝 {item.text}</Text>
                <Text style={styles.timestamp}>
                  {item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleString()
                    : ""}
                </Text>
              </View>
            )
          }
          ListEmptyComponent={
            <Text style={styles.noResults}>No results found</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#f9f9f9",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: hp(2),
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: wp(3),
    backgroundColor: "#fff",
  },
  searchBtn: {
    marginLeft: wp(2),
    backgroundColor: "#007bff",
    paddingHorizontal: wp(4),
    borderRadius: 8,
    justifyContent: "center",
  },
  searchText: {
    color: "white",
    fontWeight: "bold",
  },
  resultItem: {
    padding: wp(3),
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: hp(0.5),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  userText: {
    fontSize: wp(4.5),
    fontWeight: "bold",
  },
  postText: {
    fontSize: wp(4),
    marginBottom: hp(0.5),
  },
  timestamp: {
    fontSize: wp(3.2),
    color: "gray",
  },
  loading: {
    textAlign: "center",
    marginTop: hp(2),
    color: "gray",
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    marginTop: hp(3),
  },
});
