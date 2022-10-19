
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

async function getManifest() {
    let db = await new sqlite3.Database('dist/world_sql_content_50f67b17bc243f7570787a58395230db.content', sqlite3.OPEN_READWRITE, async (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the chinook database.');
    });

    await db.serialize(async () => {

        db.all(`SELECT json FROM DestinyInventoryItemDefinition`, async (err, row) => {
            /*  console.log(row) */
            if (err) {
                console.error(err.message);
            }

            else if (!err) {
                fs.writeFile('./Cache/ItemManifest.json', JSON.stringify(row), {
                    'flag': 'w'
                }, function (err, result) {
                    if (err) console.log('error', err);

                });
            }
        });
    });
    await db.close(async (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}
getManifest();
