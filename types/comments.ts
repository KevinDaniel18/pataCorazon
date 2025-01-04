export interface Pets{
  id: number
  name: string
}

export interface User {
  id: number;
  city: string;
  country: string;
  name: string;
  profilePicture: string;
  pets: Pets[]
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  user: User;
}

export interface CommentsProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  petId: number;
}

export interface CommentsPostFormProps {
  petId: number;
  onCommentPosted: (newComment: Comment) => void 
}
