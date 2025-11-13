import * as fs from 'fs';
import * as path from 'path';
import * as exif from 'exif-parser';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { exit } from 'process';
import { PNG } from 'pngjs';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

async function getLastModifiedDate(filePath: string): Promise<Date | undefined> {
	try {
		const buffer = await fs.promises.readFile(filePath);

		const png = new PNG();
		const parsedPromise = new Promise<PNG>((resolve, reject) => {
			png.parse(buffer, (error, data) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			});
		});

		const pngData = await parsedPromise;

		if (pngData.properties && pngData.properties.modTime) {
			return pngData.properties.modTime;
		}

		return undefined;
	} catch (error) {
		console.error('Error:', error);
		return undefined;
	}
}

async function organizeImages(inputFolder: string, outputFolder: string) {
	try {
		console.log('Organizing images...');

		// Read the files from the input folder
		const files = await readdir(inputFolder);
		console.log(`Found ${files.length} files in the input folder.`);

		for (const file of files) {
			const filePath = path.join(inputFolder, file);
			const fileStats = await stat(filePath);

			// Skip if the file is not a regular file
			if (!fileStats.isFile()) {
				console.log(`Skipping ${file} - not a regular file.`);
				continue;
			}

			const fileExtension = path.extname(file).toLowerCase();

			// Handle image files
			if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
				// Read the EXIF data from the image file
				const exifData = await readExifData(filePath);

				// Extract the LastModified date from the EXIF data
				const lastModifiedDate =
					exifData?.tags?.LastModified || exifData?.tags?.DateTime || fileStats.mtime.toISOString();

				// Parse the date
				const date = new Date(lastModifiedDate);
				const year = date.getFullYear().toString();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const formattedDay = `${day}.${month}.${year}`;

				// Create the output subfolders if they don't exist
				const outputPath = path.join(outputFolder, year, month, formattedDay);
				await mkdir(outputPath, { recursive: true });

				// Copy the image file to the output folder
				const outputFilePath = path.join(outputPath, file);
				await copyFile(filePath, outputFilePath);

				console.log(`Image file ${file} organized successfully.`);
			}

			if (fileExtension === '.png') {

				const lastModifiedDate = await getLastModifiedDate(filePath);

				if (!lastModifiedDate) {
					// throw new Error(`Error getting meta data from ${filePath}`);
					console.log(filePath);
					continue;
				}
				// Parse the date
				const date = new Date(lastModifiedDate);
				const year = date.getFullYear().toString();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const formattedDay = `${day}.${month}.${year}`;

				// Create the output subfolders if they don't exist
				const outputPath = path.join(outputFolder, year, month, formattedDay);
				await mkdir(outputPath, { recursive: true });

				// Copy the image file to the output folder
				const outputFilePath = path.join(outputPath, file);
				await copyFile(filePath, outputFilePath);

				console.log(`Image file ${file} organized successfully.`);

			}

			// Handle MP4 files
			if (fileExtension === '.mp4') {
				const lastModifiedTime = await getLastModifiedTime(filePath);

				// Parse the date
				const date = new Date(lastModifiedTime);
				const year = date.getFullYear().toString();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const formattedDay = `${day}.${month}.${year}`;

				// Create the output subfolders if they don't exist
				const outputPath = path.join(outputFolder, year, month, formattedDay);
				await mkdir(outputPath, { recursive: true });

				// Copy the MP4 file to the output folder
				const outputFilePath = path.join(outputPath, file);
				await copyFile(filePath, outputFilePath);

				console.log(`MP4 file ${file} organized successfully.`);
			}
		}

		console.log('All files organized successfully.');
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

async function readExifData(filePath: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const parser = exif.create(fs.readFileSync(filePath));
		const result = parser.parse();
		resolve(result);
	});
}

async function getLastModifiedTime(filePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const ffprobe = spawn('ffprobe', [
			'-v',
			'error',
			'-select_streams',
			'v:0',
			'-show_entries',
			'format_tags=creation_time',
			'-of',
			'default=noprint_wrappers=1:nokey=1',
			filePath,
		]);

		let lastModifiedTime = '';

		ffprobe.stdout.on('data', (data) => {
			lastModifiedTime = data.toString().trim();
		});

		ffprobe.stderr.on('data', (data) => {
			console.error(`Error retrieving last modified time: ${data}`);
		});

		ffprobe.on('close', (code) => {
			if (code !== 0) {
				console.error(`ffprobe process exited with code ${code}`);
				reject();
			} else {
				resolve(lastModifiedTime);
			}
		});
	});
}

// Set the input and output folder paths
const args = process.argv;
if (args.length !== 4) {
	console.log("Usage: program sourcePah DestinationPath");
	exit(1);
}
const sourceDirectory: string = args[2];
const destDirectory: string = args[3];

console.log(`source directory=${sourceDirectory} destination directory=${destDirectory}`);

// Run the program with the input and output folders as arguments
organizeImages(sourceDirectory, destDirectory);
