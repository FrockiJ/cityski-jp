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

/**
 * 對會員姓名進行去識別化處理
 * 顯示前3個字符，後面用***遮蔽
 * @param name - 會員姓名
 * @returns 去識別化後的姓名 (例如: Fro***)
 */
export const anonymizeName = (name: string | null): string | null => {
  if (!name || name.length === 0) {
    return name;
  }

  if (name.length <= 3) {
    return name + '***';
  }

  return name.substring(0, 3) + '***';
};

/**
 * 對手機號碼進行去識別化處理
 * 只顯示後4碼，前面用******遮蔽
 * @param phone - 手機號碼
 * @returns 去識別化後的手機號碼 (例如: ******2333)
 */
export const anonymizePhone = (phone: string | null): string | null => {
  if (!phone || phone.length === 0) {
    return phone;
  }

  if (phone.length <= 4) {
    return '******' + phone;
  }

  return '******' + phone.slice(-4);
};

/**
 * 對Email進行去識別化處理
 * 顯示前3個字符，後面用**********遮蔽
 * @param email - Email地址
 * @returns 去識別化後的Email (例如: fro**********)
 */
export const anonymizeEmail = (email: string | null): string | null => {
  if (!email || email.length === 0) {
    return email;
  }

  if (email.length <= 3) {
    return email + '**********';
  }

  return email.substring(0, 3) + '**********';
};

/**
 * 對會員資料進行去識別化處理
 * @param member - 會員物件
 * @returns 去識別化後的會員物件
 */
export const anonymizeMemberData = <T extends { name?: string | null; phone?: string | null; email?: string | null }>(
  member: T,
): T => {
  return {
    ...member,
    name: anonymizeName(member.name || null),
    phone: anonymizePhone(member.phone || null),
    email: anonymizeEmail(member.email || null),
  };
};
