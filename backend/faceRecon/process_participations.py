import time

def delayed_success():
    time.sleep(30)
    return "success"

if __name__ == "__main__":

    result = delayed_success()
    print(result)