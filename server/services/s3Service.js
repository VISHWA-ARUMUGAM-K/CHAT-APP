const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

class s3Service {
  #bucketName;
  constructor(bucketName) {
    this.#bucketName = bucketName;
    this.S3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion,
    });
  }

  async uploadFile(file) {
    const originalName = file.originalname;
    const body = file.buffer;
    const contentType = file.mimetype;

    const command = new PutObjectCommand({
      Bucket: this.#bucketName,
      Key: originalName,
      Body: body,
      contentType: contentType,
    });

    try {
      const response = await this.S3.send(command);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async fetchSignedUrl(file, expiresIn) {
    const command = new GetObjectCommand({
      Bucket: this.#bucketName,
      Key: file,
    });

    const url = await getSignedUrl(this.S3, command, { expiresIn: expiresIn });
    return url;
  }

  async createBucket(bucketName) {
    const params = {
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: "ap-south-1",
      },
    };
    const command = new CreateBucketCommand(params);
    try {
      const response = await this.S3.send(command);
      console.log("the response of createBucket is ", response);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async checkBucket(bucketName) {
    const command = new HeadBucketCommand({
      Bucket: bucketName,
    });
    try {
      const response = await this.S3.send(command);
      // console.log("the response of checkbucket is ", response);
      if (response["$metadata"].httpStatusCode === 200) {
        return true;
      }
    } catch (err) {
      return false;
      // throw err;
    }
  }

  async deleteBucketObjects(bucketName) {
    const listParams = {
      Bucket: bucketName,
    };
    try {
      const listedObjects = await this.S3.send(
        new ListObjectsV2Command(listParams),
      );
      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log("No objects to delete.");
        return;
      }

      // Step 2: Create an array of object keys for deletion
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
          Quiet: false, // Optional: set true for no response details
        },
      };

      // Step 3: Delete the objects
      const deleteResult = await this.S3.send(
        new DeleteObjectsCommand(deleteParams),
      );

      console.log(`Deleted objects:`, deleteResult.Deleted);
    } catch (err) {
      throw err;
    }
  }

  async deleteBucket(bucketName) {
    try {
      await this.deleteBucketObjects(bucketName);
    } catch (err) {
      throw err;
    }
    const command = new DeleteBucketCommand({
      Bucket: bucketName,
    });
    try {
      const response = await this.S3.send(command);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = s3Service;
