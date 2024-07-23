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
CREATE TABLE "AurDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pkgId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "strippedPackageName" TEXT NOT NULL,
    "isAur" BOOLEAN NOT NULL,
    CONSTRAINT "AurDependency_pkgId_fkey" FOREIGN KEY ("pkgId") REFERENCES "AurPackage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AurPackageVersion" (
    "versionId" TEXT NOT NULL PRIMARY KEY,
    "pkgId" TEXT NOT NULL,
    "pkgver" TEXT NOT NULL,
    "pkgrel" TEXT NOT NULL,
    "gitHash" TEXT NOT NULL,
    CONSTRAINT "AurPackageVersion_pkgId_fkey" FOREIGN KEY ("pkgId") REFERENCES "AurPackage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AurPackageBuild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pkgId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "taskJobId" TEXT NOT NULL,
    "taskPid" INTEGER,
    "logFile" TEXT NOT NULL,
    "running" BOOLEAN NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "exitCode" INTEGER,
    "success" BOOLEAN,
    "failReason" TEXT,
    CONSTRAINT "AurPackageBuild_pkgId_fkey" FOREIGN KEY ("pkgId") REFERENCES "AurPackage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AurPackageBuild_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "AurPackageVersion" ("versionId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GnupgKeys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "packageId" INTEGER NOT NULL,
    CONSTRAINT "GnupgKeys_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AurPackage" ("packageId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AurPackage_packageId_key" ON "AurPackage"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "AurPackage_name_key" ON "AurPackage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AurPackageVersion_gitHash_key" ON "AurPackageVersion"("gitHash");

-- CreateIndex
CREATE UNIQUE INDEX "AurPackageBuild_taskJobId_key" ON "AurPackageBuild"("taskJobId");

-- CreateIndex
CREATE UNIQUE INDEX "GnupgKeys_packageId_key" ON "GnupgKeys"("packageId");
