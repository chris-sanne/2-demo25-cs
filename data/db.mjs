import pg from "pg";
const { Client } = pg;

const config = {
    connectionString: process.env.DB_CREDENTIALS,
    ssl: process.env.DB_SSL === "true" ? process.env.DB_SSL : { "rejectUnauthorized": false }
};


const client = new Client(config);

/* await client.connect(); */

try {
    await client.connect();
    console.log("Connected to the database successfully!")
} catch (error) {
    console.log("Database connection failed:", error);
} finally {
    await client.end();
    console.log("Connection closed.");
}

function create(statement, ...values) {
    try {        
        client.connect();
        const result = client.query(statement, [...values]);

        if(result.rowCount <= 0) { //rowCount eller rowcount?
            throw new Error("No records created");
        }

        return result.row[0];
    } catch (error) {
        // Feilhåndtering
        console.log(error);
        return null;
    } finally {
        client.end();
    }
}