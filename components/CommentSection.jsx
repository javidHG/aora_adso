import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const CommentSection = ({ comments, onAddComment, onRemoveComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleRemoveComment = (commentId) => {
    if (typeof onRemoveComment === 'function') { // Verifica que onRemoveComment es una función
      onRemoveComment(commentId);
    } else {
      console.error('onRemoveComment is not a function');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{item.text}</Text>
            <TouchableOpacity onPress={() => handleRemoveComment(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noCommentsText}>No comments yet</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          placeholderTextColor="gray"
          style={styles.textInput}
        />
        <Button title="Send" onPress={handleAddComment} color="#007bff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  commentContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    position: 'relative',
  },
  commentText: {
    color: '#fff',
    fontSize: 14,
  },
  removeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  removeButtonText: {
    color: '#ff6347', // Tomate rojo para indicar eliminación
    fontSize: 12,
  },
  noCommentsText: {
    color: 'gray',
    textAlign: 'center',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#222',
    color: '#fff',
  },
});

export default CommentSection;
