const typeDefs = `

  interface Node{
      id:ID!
  }

  type User implements Node{
      id: ID!
      name: String!
      email: String!
      folders:[Folder!]
  }
  
  type Link implements Node{
      id:ID!
      url: String!
      isCompleted: Boolean!
      title: String
      description: String
      thumbnail: String
  }

  type LinkEdge{
      node: Link!
      cursor: String!
  }

  type PageInfo{
      hasNextPage: Boolean!
      endCursor: String
  }

  type LinkWrapper{
      totalCount: Int!
      edges:[LinkEdge!]
      pageInfo: PageInfo!
  }
  
  input FolderLinkFiltersV2{
      isCompleted:Boolean
      first:Int
      after:String
  }

  type Folder implements Node{
      id: ID!
      name: String!
      links(input:FolderLinkFilters): [Link!]
      linksV2(input:FolderLinkFiltersV2):LinkWrapper!
  }

  enum NodeType{
      USER
      FOLDER
      LINK
  }

  enum MultiNodeType{
      USER
      FOLDER
      LINK
  }

  input NodeInput{
      id: ID!
      type: NodeType!
  }

  input MultiNodeInput{
      ids:[ID!]!
      type: MultiNodeType!
  }

  input AddFolderInput{
      name: String!
  }

  input UpdateFolderInput{
      id:ID!
      name: String
      userId: String
  }

  input DeleteFolderInput{
      id:ID!
  } 

  input AddLinkInput{
      url:String!
      folderId: ID!
      isCompleted:Boolean
  }

  input UpdateLinkInput{
      url: String
      folderId:ID
      isCompleted:Boolean
      id: ID! 
  }

  input DeleteLinkInput{
      id:ID!
  }

  input UpdateLinkMetadataInput{
      url:String!
      id: ID!
  }

  input FolderLinkFilters{
      isCompleted: Boolean!
  }

  input UpdateUserInput{
      id:ID!
      name:String
      email:String
  }

  type FolderMutations{
     addFolder(input:AddFolderInput!):Folder!
     updateFolder(input:UpdateFolderInput!):Folder!
     deleteFolder(input:DeleteFolderInput!):Folder!
  }

  type LinkMutations{
      addLink(input:AddLinkInput!):Link!
      updateLink(input:[UpdateLinkInput!]!):[Link!]!
      deleteLink(input:[DeleteLinkInput!]!):[Link!]!
      updateLinksMetadata(input:[UpdateLinkMetadataInput!]!):[Link!]!
  }

  type UserMutations{
      updateUser(input:UpdateUserInput!):User!
  }

   type Query{
      node(input:NodeInput!):Node
      multiNode(input:MultiNodeInput!):[Node]!
  }

  type Mutation{
      linkManagement: LinkMutations!
      folderManagement: FolderMutations!
      userManagement: UserMutations!
  }
`;

module.exports = { typeDefs };
