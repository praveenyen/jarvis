import { NextResponse } from 'next/server';
import ServerAuthHelper from '@/auth/ServerAuthHelper';
import { getSpecifiedUsers } from '@/lib/queries/hera/services';
import HttpClientException from '@/lib/exceptions/HttpClientException';
import { getAppFormList } from '@/lib/queries/shield/services';
import { headers } from 'next/headers';
import { normalizeErrorObject } from '@/lib/utils/routeHandlerUtils';

export async function GET(request: Request) {
  const token = await ServerAuthHelper.getTokenFromCookies();
  const authHeaders = ServerAuthHelper.getAuthHeader(token);
  const headersList = await headers();
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    console.log('QUERY STRING', queryString);
    const filters = searchParamsToRecord(searchParams);
    const userDetails = ServerAuthHelper.parseJwtToken(token);
    const userId = userDetails.sub;

    authHeaders['role'] = headersList.get('role')!;
    authHeaders['stage'] = headersList.get('stage')!;
    authHeaders['requestingSub'] = userId;
    // authHeaders['requestingSub'] = 'abcd';

    const res = await getAppFormList(filters, authHeaders, undefined);
    return NextResponse.json(res, { status: 200 });
  } catch (error: unknown) {
    let statusCode = 500;
    if (error instanceof HttpClientException) {
      statusCode = error.statusCode ? error.statusCode : 500;
      return NextResponse.json(
        {
          ...normalizeErrorObject(error.getErrorResp()),
        },
        { status: statusCode },
      );
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: statusCode },
    );
  }

  /*  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    console.log('QUERY STRING', queryString);
    // Create a dynamic params object

    // Add other parameters dynamically from searchParams
    const res = await shieldAxios(
      'GET',
      `appForm/list?${queryString}`,
      {},
      {
        role: 'qcadmin',
        stage: 'all',
        requestingSub: 'abcd',
      },
    );

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error('Error occurred:', error);

    // Handle Axios errors
    if (error.isAxiosError) {
      const statusCode = error.response?.status || 500;
      const errorDetails = {
        message: error.message,
        status: statusCode,
        headers: error.response?.headers || {},
        data: error.response?.data || {},
        config: error.config || {},
      };

      console.error('Axios Error Details:', errorDetails);

      return NextResponse.json(
        {
          error: 'Failed to fetch data from the API',
          details: errorDetails,
        },
        { status: statusCode },
      );
    }

    // Handle other errors
    console.error('Unexpected Error:', error.message);

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: {
          message: error.message,
          stack: error.stack,
        },
      },
      { status: 500 },
    );
  }*/
}

function searchParamsToRecord(
  searchParams: URLSearchParams,
): Record<string, string> {
  return Object.fromEntries(searchParams.entries());
}

// app/api/example/route.ts

// export async function GET(req: Request) {
//     const axiosClient = createAxiosClient(process.env.SHIELD_SERVER); // Create an instance with the request object

//     try {
//         const response = await axiosClient.get('appForm/df32249b-3916-483d-80bf-4c52be2e0efc'); // Replace with your actual endpoint
//         return NextResponse.json(response.data); // Return the data received from the external API
//     } catch (error:unknown) {
//         console.error('Error fetching data:', error);
//         return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
//     }
// }
