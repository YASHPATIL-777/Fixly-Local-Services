import cloudinary from '../config/cloudinary.js';

/**
 * Upload array of Multer memory buffer files to Cloudinary under folder fixnear/problem-images
 * @param {Array} files - Array of Multer file objects with buffer properties
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export const uploadImagesToCloudinary = async (files = []) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  // Ensure Cloudinary environment variables are configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing.');
  }

  const uploadedAssets = [];

  try {
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'fixnear/problem-images',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              return reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        );
        uploadStream.end(file.buffer);
      });

      uploadedAssets.push(result);
    }

    return uploadedAssets;
  } catch (error) {
    // Failure cleanup: If any single image fails, destroy already uploaded images in this batch
    if (uploadedAssets.length > 0) {
      await deleteCloudinaryImages(uploadedAssets);
    }
    throw error;
  }
};

/**
 * Delete uploaded Cloudinary assets by publicId
 * @param {Array<{publicId: string}|string>} images - Array of image objects or publicId strings
 */
export const deleteCloudinaryImages = async (images = []) => {
  if (!images || !Array.isArray(images) || images.length === 0) return;

  for (const img of images) {
    const publicId = typeof img === 'string' ? img : img?.publicId;
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`[Cloudinary Cleanup] Deleted asset: ${publicId}`);
      } catch (err) {
        console.error(`[Cloudinary Cleanup Error] Failed to delete publicId ${publicId}:`, err.message);
      }
    }
  }
};

// Legacy alias for backwards compatibility
export const processUploadedFiles = uploadImagesToCloudinary;
export const deleteLocalFiles = deleteCloudinaryImages;
