import pyperclip
import time

if __name__ == '__main__':
    last = ""

    while True:
        try:
            current = pyperclip.paste()

            if current and current != last:
                print("Copied:", current)

                with open("clipboard.txt", "a", encoding="utf-8") as f:
                    f.write(current.replace("\n", "\\n"))
                    f.write("\n")

                last = current

            time.sleep(0.1)

        except KeyboardInterrupt:
            print("\nStopping clipboard monitor...")
            break