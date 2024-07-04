function parseSorter(sortStr: string): { [key: string]: string } {
  if (sortStr) {
    const sorts = sortStr.split(',');
    const result: { [key: string]: string } = {};
    for (const sort of sorts) {
      const [field, order] = sort.split(':');
      result[field] = order;
    }
  }
  return {};
}

export default parseSorter;
