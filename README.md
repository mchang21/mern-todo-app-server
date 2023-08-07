## Starting the Server

Before running the Todo List web app, make sure to set up and start the server. Follow these steps:

1. Start the MongoDB server by running the following command in your terminal:
   ```shell
   mongod
    ```
2. Open a new terminal window and launch the MongoDB shell (mongosh) by entering the following command:
    ```shell
    mongosh
    ```
3. Within the MongoDB shell, switch to the "todos" database by entering:
    ```shell
    use todos
    ```
4. Return to the terminal window containing the project directory for the server and run the server using the following command:
    ```shell
    node server
    ```

Your server should now be running and ready to handle requests from the Todo List web app.