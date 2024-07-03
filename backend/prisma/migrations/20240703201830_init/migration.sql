-- CreateTable
CREATE TABLE "AurPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" INTEGER NOT NULL,
    "lastModifiedDatabaseEntry" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "packageBaseId" INTEGER NOT NULL,
    "packageBase" TEXT NOT NULL,
    "maintainer" TEXT,
    "votes" INTEGER NOT NULL,
    "popularity" REAL NOT NULL,
    "firstSubmitted" DATETIME NOT NULL,
    "lastModified" DATETIME NOT NULL,
    "flaggedOutOfDate" BOOLEAN,
    "currentVersion" TEXT NOT NULL,
    "urlPath" TEXT,
    "url" TEXT
);

-- CreateTable
CREATE TABLE "AurPackageLicense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" INTEGER NOT NULL,
    "license" TEXT NOT NULL,
    CONSTRAINT "AurPackageLicense_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AurPackage" ("packageId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AurDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" INTEGER NOT NULL,
    "packageName" TEXT NOT NULL,
    CONSTRAINT "AurDependency_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AurPackage" ("packageId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AurMakeDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" INTEGER NOT NULL,
    "packageName" TEXT NOT NULL,
    CONSTRAINT "AurMakeDependency_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AurPackage" ("packageId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AurKeyword" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyword" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AurPackageCoMaintainer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "AurPackageCoMaintainer_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AurPackage" ("packageId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AurPackageVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    CONSTRAINT "AurPackageVersion_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AurPackage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AurKeywordToAurPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AurKeywordToAurPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "AurKeyword" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AurKeywordToAurPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "AurPackage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AurPackage_packageId_key" ON "AurPackage"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "AurKeyword_keyword_key" ON "AurKeyword"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "_AurKeywordToAurPackage_AB_unique" ON "_AurKeywordToAurPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_AurKeywordToAurPackage_B_index" ON "_AurKeywordToAurPackage"("B");
