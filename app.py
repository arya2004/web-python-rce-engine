import sys
from io import StringIO
sys.stdout = StringIO()

import random

i = 0

while i < 100000:
    num = random.random()
    print(num)
    i = i + 1



sys.stdout.getvalue()