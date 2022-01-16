const typeDefs = `

  interface Node{
      id:ID!
  }

  type User implements Node{
      id: ID!
      name: String!
      email: String!
      resources:[Resource]!
  }

  type Resource implements Node{
      id: ID!
      url: String!
      thumbnail: String
      tag: String!
      description: String
  }

  enum NodeType{
      USER
      RESOURCE
  }

  enum MultiNodeType{
      USER
      RESOURCE
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
      node(input:NodeInput!):Node
      multiNode(input:MultiNodeInput!):[Node]!
  }
`;

module.exports = { typeDefs };
