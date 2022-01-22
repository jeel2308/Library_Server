const typeDefs = `

  interface Node{
      id:ID!
  }

  interface MutationResponse{
      success: Boolean!
  }

  type AddFolderMutationResponse implements MutationResponse{
      success: Boolean!
      folder: Folder
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
  }
  
  type Folder implements Node{
      id: ID!
      name: String!
      links: [Link!]
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

  type Query{
      user(id:ID!):User!
      folder(id:ID!):Folder!
      link(id:ID!):Link!
      node(input:NodeInput!):Node
      multiNode(input:MultiNodeInput!):[Node]!
  }

  input AddFolderInput{
      name: String!
  }

  type Mutation{
      addFolder(input:AddFolderInput!):AddFolderMutationResponse!
  }
`;

module.exports = { typeDefs };
