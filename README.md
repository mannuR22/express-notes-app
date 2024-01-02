
# Express Notes Application

## Geting Started:

- Make sure mongodb and nodejs are already installed in system.

- Run following command in root of this repository for installing required node-packages:
```
npm i
```

- For starting server, run following command in root of this repository:
```
node main.js
```

- For runing JEST test cases, run following command in root of this repository:
```
npx jest
```

- Debugging Logs will be written in ./logs/info.log & printed on console.



## Tech Used:

 - Node js
 - JWT
 - Mongodb (mongoose)
 - bcrypt
 - Postman (for APIs)
 - Winston (for logging)











## API Reference


#### User Registeration:

```http
  POST localhost:3001/api/auth-service/register
```
Request Body
```
{
    "username": "testuser",
    "password": "testuser123",
}
```
Response Body
```
{
    "message": "User created Successfully.",
    "userInfo": {
      "username": "testuser",
    }
}
```

#### User Login:
```http
  POST localhost:3001/api/auth-service/login
```

Request Body
```
{
    "username": "testuser",
    "password": "testuser123"
}
```

Response Body
```
{
    "message": "Auth successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI......xWBrAAYoXTIJaAk"
}
```

#### User Logout:

*Auth-token required**
```http
  POST localhost:3001/api/auth-service/logout
```

Response Body
```
{
    "message": "User logout success."
}
```

#### Create Note:

```http
  POST localhost:3001/api/notes-service/create
```

Request Body
```
{
    "title": "Example Title",
    "content": "Example Content"
}
```

Response Body
```
{
    "message": "Note created Successfully.",
    "metaInfo": {
        "noteId": 2625b687-4d9c-4ee0-80f6-222e1ff4f56e,
    }
}
```

#### Read Notes: (Getting list of all notes created by user)

```http
  GET localhost:3001/api/notes-service/notes
```
Response Body
```
{
    "message": "All Notes for user retrieved successfully.",
    "notes": [
    {
      "_id": "2b70ac16-2f35-4eb1-894d-5299cb2b3da2",
      "title": "Example-title-1"
    },
    {
      "_id": "63ea6dda-99f0-4da1-80c2-4a6cef345d79",
      "title": "Example-title-2"
    },
    {
      "_id": "90fe385f-35d4-407f-afbd-2eb29f5407d4",
      "title": "Example-title-3"
    }
  ]
}
```
#### Read Notes: (For Specific Note)

```http
  GET localhost:3001/api/notes-service/notes?noteid=90fe385f-35d4-407f-afbd-2eb29f5407d4
```
| Query     | Description                |
| :-------- | :------------------------- |
| `noteid`   | *Only for reading specific note* |

Response Body
```
{
  "content": "test-content-1",
  "createdAt": 1704120959367,
  "lastUpdatedOn": 1704120959557,
  "title": "test-title-3"
}
```

#### Update Note

```http
  PUT localhost:3001/api/notes-service/update/${noteId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `noteId` | `string` | **Required** |



Request Body

*Either of field required in request body**
```
{
    "title": "Example Update Title",
    "content": "Example Update Content"
}
```

Response Body
```
{
  "updatedNote": {
    "content": "test-content-1updated",
    "title": "test-title-1updated"
  }
}
```

#### Delete Note

```http
  DELETE localhost:3001/api/notes-service/delete/${noteId}
```


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `noteId` | `string` | **Required** |

Response Body
```
{
  "message": "Successfully deleted note document.",
  "metaInfo" {
    "noteId":"1e4d09be-ab0c-4d1e-83f2-0e98aa2a56dc"
  }
}
```



## Author

- [@mannuR22](https://www.github.com/mannuR22)