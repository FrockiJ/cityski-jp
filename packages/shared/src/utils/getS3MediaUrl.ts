export function getS3MediaUrl(filename: string): string {
  if (!filename) {
    return `${process.env.NEXT_PUBLIC_AWS_S3_URL}empty.png`;
  }
  return `${process.env.NEXT_PUBLIC_AWS_S3_URL}${filename}`;
}
