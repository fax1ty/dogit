import { Command, SpawnOptions } from "@tauri-apps/api/shell";

export const executeBase = (
  base: string,
  args?: string | string[],
  options?: SpawnOptions & { timeout?: number; verbose?: boolean }
) => {
  return new Promise<string>((res, rej) => {
    const cmd = new Command(base, args, options);
    cmd.stdout.on("data", (v) => {
      if (options?.verbose) console.info(base, args, v);
    });
    if (typeof options?.timeout === "number") {
      setTimeout(() => {
        cmd.emit("close", { code: 124 });
      }, options.timeout);
    }
    cmd
      .execute()
      .then((cmd) => {
        if (cmd.code !== 0) {
          console.error(
            `Ошибка при выполнении нативной команды "${base}${args ? " " : ""}${
              args ? (Array.isArray(args) ? args.join(" ") : args) : ""
            }". Код: ${cmd.code}`,
            cmd.stderr,
            cmd.stdout
          );
          return rej({ code: cmd.code, message: cmd.stderr });
        }
        res(cmd.stdout);
      })
      .catch((error) => rej(error));
  });
};
