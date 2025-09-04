export const formattedTableWithFiles = (data: any[]) => {
  const formattedData = data.reduce((acc, row) => {
    const existing = acc.find(
      (homeBanner) => homeBanner.id === row.homeBanner_id,
    );

    if (!existing) {
      acc.push({
        id: row.homeBanner_id,
        buttonUrl: row.homeBanner_button_url,
        files: row.file_id
          ? [
              {
                id: row.file_id,
                tableName: row.file_table_name,
                deviceType: row.file_device_type,
                mediaType: row.file_media_type,
                url: row.file_file_url,
                originalName: row.file_original_name,
                sequence: row.file_sequence,
              },
            ]
          : [],
      });
    } else if (row.file_id) {
      existing.files.push({
        id: row.file_id,
        tableName: row.file_table_name,
        deviceType: row.file_device_type,
        mediaType: row.file_media_type,
        url: row.file_file_url,
        originalName: row.file_original_name,
        sequence: row.file_sequence,
      });
    }

    return acc;
  }, []);

  return formattedData;
};
