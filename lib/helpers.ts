/**
 * Extracts the 'code' parameter from a given URL.
 * @param url - The full URL containing the code parameter.
 * @returns The extracted code, or null if no valid code is found.
 */
function extractCodeFromUrl(url: string) {
  try {
    // Create a URL object
    const urlObject = new URL(url);

    // Get the 'code' parameter
    const code = urlObject.searchParams.get("code");

    if (!code) {
      return null;
    }

    // Split the code at '#_' and return the first part
    const [extractedCode] = code.split("#_");

    return extractedCode || null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}
export default extractCodeFromUrl;
