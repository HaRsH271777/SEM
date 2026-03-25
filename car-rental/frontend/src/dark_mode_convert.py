import os

files = [
    r"c:\VSCode\SEM\SEM-main\SEM-main\car-rental\frontend\src\pages\SearchPage.tsx",
    r"c:\VSCode\SEM\SEM-main\SEM-main\car-rental\frontend\src\pages\VehicleDetails.tsx"
]

replacements = {
    "bg-white": "bg-[#1b1b1b]",
    "text-gray-900": "text-white",
    "text-gray-600": "text-gray-400",
    "text-gray-6000": "text-gray-500",
    "border-gray-200": "border-gray-800",
    "bg-gray-50/50": "bg-[#252525]/50",
    "bg-gray-50": "bg-[#252525]",
    "hover:bg-gray-50": "hover:bg-[#333333]",
    "bg-primary-50 ": "bg-primary-900/40 ",
    "text-primary-600": "text-primary-400",
    "bg-white shadow-sm border-gray-200 text-gray-600 hover:text-gray-600": "bg-[#1b1b1b] shadow-sm border-gray-800 text-gray-400 hover:text-gray-300",
}

for fp in files:
    with open(fp, "r", encoding="utf-8") as f:
        content = f.read()

    # Manual specific replacements just in case
    # In SearchPage.tsx
    content = content.replace("container-app py-8", "container-app py-8 bg-[#0d0e14] text-white min-h-screen max-w-none")
    # In VehicleDetails.tsx
    content = content.replace("max-w-7xl mx-auto px-4", "max-w-7xl mx-auto px-4")
    # Actually wait, maybe applying it to the outer container in VehicleDetails too
    # VehicleDetails outer div: <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    content = content.replace("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", "max-w-none min-h-screen bg-[#0d0e14] text-white px-4 sm:px-6 lg:px-8 py-8")

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(fp, "w", encoding="utf-8") as f:
        f.write(content)

print("Replacement complete.")
