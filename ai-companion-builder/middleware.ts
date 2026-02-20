cookies: {
  get(name: string) {
    return req.cookies.get(name)?.value;
  },
  set(name: string, value: string, options: any) {
    res.cookies.set({ name, value, ...options });
  },
  remove(name: string, options: any) {
    res.cookies.set({ name, value: "", ...options });
  }
}
