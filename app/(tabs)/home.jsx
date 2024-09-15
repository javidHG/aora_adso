import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);
  const [comments, setComments] = useState({});

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddComment = (postId, commentText) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), { id: Date.now().toString(), text: commentText }]
    }));
  };

  const handleRemoveComment = (postId, commentId) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: prevComments[postId].filter(comment => comment.id !== commentId)
    }));
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#121212' }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            comments={comments[item.$id] || []}
            onAddComment={(commentText) => handleAddComment(item.$id, commentText)}
            onRemoveComment={(commentId) => handleRemoveComment(item.$id, commentId)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              <View>
                <Text style={{ color: '#aaa', fontSize: 14 }}>Welcome Back</Text>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>JSMastery</Text>
              </View>
              <Image
                source={images.logoSmall}
                style={{ width: 36, height: 40 }}
                resizeMode="contain"
              />
            </View>
            <SearchInput />
            <View style={{ marginTop: 24 }}>
              <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>Latest Videos</Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
