const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./db'); // Import MySQL connection

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);


// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Generate unique filename
    }
});
const upload = multer({ storage: storage });

// POST route for saving project data and file attachments
app.post('/saveProject', upload.single('attachment'), (req, res) => {
    const { projectName, task, dueDate, assignTo, subProjects } = req.body;
    const attachment = req.file; // Uploaded file info

    // Save project data to 'projects' table
    db.query(
        'INSERT INTO projects (projectName, task, dueDate, assignTo) VALUES (?, ?, ?, ?)',
        [projectName, task, dueDate, assignTo],
        (err, result) => {
            if (err) throw err;

            const projectId = result.insertId; // Get the inserted project ID

            // Save file attachment info to 'attachments' table
            if (attachment) {
                db.query(
                    'INSERT INTO attachments (projectId, fileName, filePath, fileType, fileSize) VALUES (?, ?, ?, ?, ?)',
                    [projectId, attachment.originalname, attachment.path, attachment.mimetype, attachment.size],
                    (err) => {
                        if (err) throw err;
                    }
                );
            }

            // Save sub-project and sub-task data to 'sub_projects' table
            subProjects.forEach(({ subProjectName, subTask, subDueDate, subAssignTo }) => {
                db.query(
                    'INSERT INTO sub_projects (projectId, subProjectName, subTask, subDueDate, subAssignTo) VALUES (?, ?, ?, ?, ?)',
                    [projectId, subProjectName, subTask, subDueDate, subAssignTo],
                    (err) => {
                        if (err) throw err;
                    }
                );
            });

            res.send('Project data saved successfully!');
        }
    );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
